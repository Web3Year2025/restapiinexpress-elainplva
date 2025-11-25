import { createAlbumSchema } from '../../src/models/album';

const validAlbum = {
  "title": "The Dark Side of the Moon",
  "artist": "Pink Floyd",
  "rating": 5,
  "acquiredDate": "2023-10-15",
  "isBorrowed": false,
  "owner": "Elain"
}

describe("Acquired Date Validation", () => {
  it("should pass for valid date formats", () => {
    const validDates = [
      "1970/01/01",
      "1987/12/03",
      "1987-11-30",
      "2022-06-15",
    ];

    validDates.forEach((date) => {
      expect(() =>
        createAlbumSchema.parse({ ...validAlbum, acquiredDate: date })
      ).not.toThrow();
    });
  });

  it("should fail for invalid date formats", () => {
    const invalidDates = [
      "2026ty/01/02",  // nonsense
      "2000/13/01",    // wrong month
      "1st march 20121", // nonsense
      "blah blah",     // invalid string
    ];

    invalidDates.forEach((date) => {
      expect(() =>
        createAlbumSchema.parse({ ...validAlbum, acquiredDate: date })
      ).toThrow();
    });
  });
});

describe("Rating Validation", () => {
  it("should pass for valid ratings between 1 and 5", () => {
    const validRatings = [1, 2, 3, 4, 5];

    validRatings.forEach((rating) => {
      expect(() =>
        createAlbumSchema.parse({ ...validAlbum, rating })
      ).not.toThrow();
    });
  });

  it("should pass when rating is omitted (optional)", () => {
    const { rating, ...albumWithoutRating } = validAlbum;
    expect(() =>
      createAlbumSchema.parse(albumWithoutRating)
    ).not.toThrow();
  });

  it("should fail for ratings outside 1-5 range", () => {
    const invalidRatings = [0, -1, 6, 10, 100];

    invalidRatings.forEach((rating) => {
      expect(() =>
        createAlbumSchema.parse({ ...validAlbum, rating })
      ).toThrow();
    });
  });

  it("should fail for non-numeric ratings", () => {
    expect(() =>
      createAlbumSchema.parse({ ...validAlbum, rating: "five" } as any)
    ).toThrow();
  });
});

describe("Required Fields Validation", () => {
  it("should fail when title is missing", () => {
    const { title, ...albumNoTitle } = validAlbum;
    expect(() =>
      createAlbumSchema.parse(albumNoTitle)
    ).toThrow();
  });

  it("should fail when title is empty string", () => {
    expect(() =>
      createAlbumSchema.parse({ ...validAlbum, title: "" })
    ).toThrow();
  });

  it("should fail when artist is missing", () => {
    const { artist, ...albumNoArtist } = validAlbum;
    expect(() =>
      createAlbumSchema.parse(albumNoArtist)
    ).toThrow();
  });

  it("should fail when artist is empty string", () => {
    expect(() =>
      createAlbumSchema.parse({ ...validAlbum, artist: "" })
    ).toThrow();
  });

  it("should fail when acquiredDate is missing", () => {
    const { acquiredDate, ...albumNoDate } = validAlbum;
    expect(() =>
      createAlbumSchema.parse(albumNoDate)
    ).toThrow();
  });

  it("should fail when isBorrowed is missing", () => {
    const { isBorrowed, ...albumNoBorrowed } = validAlbum;
    expect(() =>
      createAlbumSchema.parse(albumNoBorrowed)
    ).toThrow();
  });
});

describe("Optional Fields Validation", () => {
  it("should pass when owner is omitted (optional)", () => {
    const { owner, ...albumWithoutOwner } = validAlbum;
    expect(() =>
      createAlbumSchema.parse(albumWithoutOwner)
    ).not.toThrow();
  });

  it("should pass with any valid string for owner", () => {
    const owners = ["Elain", "John Smith", "X", ""];
    owners.forEach((owner) => {
      expect(() =>
        createAlbumSchema.parse({ ...validAlbum, owner })
      ).not.toThrow();
    });
  });
});

describe("Extra Fields Rejection", () => {
  it("should reject albums with extra properties not in schema", () => {
    const result = createAlbumSchema.safeParse({
      ...validAlbum,
      silly: "this is not just silly but dangerous",
      extraField: "should be rejected"
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});