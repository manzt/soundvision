const defaultState = {
  library: [],
  albumSelection: [],
  songSelection: [],
  displayName: 'unknown',
  photo: null
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
        photo: action.photo
      };
    case 'CLEAR_SONG_SELECTION':
      return {
        ...state,
        songSelection: []
      };
    default:
      return state;
  }
}

// if (action.albumSelection.length === 0) {
//   return {
//     ...state,
//     albumSelection: []
//   };
// } else if (action.albumSelection.length > state.albumSelection.length) {
//   let newAlbum;
//   let ids = state.albumSelection.map(album => album.id)
//   action.albumSelection.forEach(album => ids.indexOf(album.id) === -1 ? newAlbum = album : null)
//   return {
//     ...state,
//     albumSelection: [newAlbum, ...state.albumSelection]
//   };
// } else {
//   let deleteId;
//   let ids = action.albumSelection.map(album => album.id);
//   state.albumSelection.forEach(album => ids.indexOf(album.id) === -1 ? deleteId = album.id : null);
//   return {
//     ...state,
//     albumSelection: state.albumSelection.filter(album => album.id !== deleteId)
//   }
// };

export default reducer;
