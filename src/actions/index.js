export function handleClearAlbumSelection(albumSelection) {
  return {
    type: 'CLEAR_ALBUM_SELECTION',
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

export function handleUserInfo(displayName, spotifyID) {
  return {
    type: 'SET_USER_INFO',
    displayName,
    spotifyID
  }
}

export function handleClearSongSelection() {
  return {
    type: 'CLEAR_SONG_SELECTION'
  }
}

export function handleAlbumAdd(album) {
  return {
    type: 'ADD_ALBUM_SELECTION',
    album
  }
}

export function handleAlbumRemove(album) {
  return {
    type: 'REMOVE_ALBUM_SELECTION',
    album
  }
}

export function handleModeChange(mode) {
  return {
    type: 'MODE_CHANGE',
    mode
  }
}
