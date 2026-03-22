import { Request, Response } from 'express';

const LASTFM_KEY = process.env.LASTFM_API_KEY;
const LASTFM_BASE = 'https://ws.audioscrobbler.com/2.0';

export const searchAlbumsLastFm = async (req: Request, res: Response) => {
  const query = req.query.query as string;

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const response = await fetch(
      `${LASTFM_BASE}/?method=album.search&album=${encodeURIComponent(query)}&api_key=${LASTFM_KEY}&format=json&limit=12`
    );
    const data = await response.json();

    const albums = data?.results?.albummatches?.album?.map((album: any) => ({
      name: album.name,
      artist: album.artist,
      image: album.image?.find((img: any) => img.size === 'large')?.['#text'] || '',
      url: album.url
    })) || [];

    res.status(200).json(albums);
  } catch (error) {
    console.error('Last.fm search error:', error);
    res.status(500).json({ message: 'Failed to search Last.fm' });
  }
};

export const getAlbumDetailsLastFm = async (req: Request, res: Response) => {
  const { artist, album } = req.query as { artist: string; album: string };

  if (!artist || !album) {
    return res.status(400).json({ message: 'Artist and album are required' });
  }

  try {
    const response = await fetch(
      `${LASTFM_BASE}/?method=album.getinfo&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&api_key=${LASTFM_KEY}&format=json`
    );
    const data = await response.json();
    const info = data?.album;

    if (!info) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.status(200).json({
      name: info.name,
      artist: info.artist,
      releaseDate: info.wiki?.published || null,
      image: info.image?.find((img: any) => img.size === 'extralarge')?.['#text'] || '',
      url: info.url,
      summary: info.wiki?.summary || ''
    });
  } catch (error) {
    console.error('Last.fm detail error:', error);
    res.status(500).json({ message: 'Failed to get album details' });
  }
};

export const getTrendingAlbums = async (req: Request, res: Response) => {
  // You can change this tag to anything: "pop", "rock", "hip-hop", "indie" etc.
  const tag = (req.query.tag as string) || 'pop';

  try {
    const response = await fetch(
      `${LASTFM_BASE}/?method=tag.gettopalbums&tag=${encodeURIComponent(tag)}&api_key=${LASTFM_KEY}&format=json&limit=12`
    );
    const data = await response.json();

    const albums = data?.albums?.album?.map((album: any) => ({
      name: album.name,
      artist: album.artist?.name,
      image: album.image?.find((img: any) => img.size === 'extralarge')?.['#text'] || '',
      url: album.url
    })).filter((album: any) => album.image !== '') || [];
    // filter out albums with no image so the UI looks clean

    res.status(200).json(albums);
  } catch (error) {
    console.error('Last.fm trending error:', error);
    res.status(500).json({ message: 'Failed to fetch trending albums' });
  }
};