export function handleAlbumSelection(albumSelection) {
  return {
    type: 'UPDATE_ALBUM_SELECTION',
    albumSelection,
  };
}

export function handleSongSelection(songSelection) {
  return {
    type: 'UPDATE_SONG_SELECTION',
    songSelection,
  };
}

export function handleLibraryImport(library) {
  return {
    type: 'HANDLE_LIBRARY_IMPORT',
    library,
  }
}
