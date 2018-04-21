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

export function handleSongRemove(song) {
  return {
    type: 'REMOVE_SONG',
    song
  }
}

export function handleUserInfo(displayName, photo) {
  return {
    type: 'SET_USER_INFO',
    displayName,
    photo
  }
}

export function handleClearSongSelection() {
  return {
    type: 'CLEAR_SONG_SELECTION'
  }
}
