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