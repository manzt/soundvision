const defaultState = {
  library: [],
  albumSelection: [],
  songSelection: [],
  displayName: null,
  spotifyID: null,
  mode: 'uknown'
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'HANDLE_LIBRARY_IMPORT':
      return {
        ...state,
        library: action.library
      };
    case 'CLEAR_ALBUM_SELECTION':
        return {
          ...state,
          albumSelection: []
        };
    case 'ADD_ALBUM_SELECTION':
        return {
          ...state,
          albumSelection: [action.album, ...state.albumSelection]
        };
    case 'REMOVE_ALBUM_SELECTION':
        return {
          ...state,
          albumSelection: state.albumSelection.filter(album => album.id !== action.album.id)
        };
    case 'UPDATE_SONG_SELECTION':
      return {
        ...state,
        songSelection: [...state.songSelection, action.songSelection]
      };
    case 'REMOVE_SONG':
      let songs = state.songSelection.filter(item => item.uniqID !== action.song.uniqID)
      return {
        ...state,
        songSelection: songs
      };
    case 'SET_USER_INFO':
      return {
        ...state,
        displayName: action.displayName,
        spotifyID: action.spotifyID
      };
    case 'CLEAR_SONG_SELECTION':
      return {
        ...state,
        songSelection: []
      };
    case 'MODE_CHANGE':
      return {
        ...state,
        mode: action.mode
      }
    default:
      return state;
  }
}

export default reducer;
