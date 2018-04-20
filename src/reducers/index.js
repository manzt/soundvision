const defaultState = {
  library: [],
  albumSelection: [],
  songSelection: [],
  loggedIn: true
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'HANDLE_LIBRARY_IMPORT':
      return {
        ...state,
        library: action.library
      };
    case 'UPDATE_ALBUM_SELECTION':
      return {
        ...state,
        albumSelection: action.albumSelection
      };
    case 'UPDATE_SONG_SELECTION':
      return {
        ...state,
        songSelection: [...state.songSelection, action.songSelection]
      };
    case 'REMOVE_SONG':
      let songs = state.songSelection.filter(item => item.id !== action.song.id)
      return {
        ...state,
        songSelection: songs
      }
    default:
      return state;
  }
}

export default reducer;
