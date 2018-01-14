export const NAVIGATE = "NAVIGATE";

export function navigate(title, url, parent) {
  return { type: NAVIGATE, title, url, parent };
}

const defaultState = {
  title: "Home"
};

export default function booksReducer(state = defaultState, action) {
  switch (action.type) {
    case NAVIGATE:
      document.title = action.title;

      return { ...state, title: action.title, url: action.url, parent: action.parent };
    default:
      return state;
  }
}
