export const NAVIGATE = "NAVIGATE";

export function navigate(title, url, parent) {
  return { type: NAVIGATE, title, url, parent };
}

const defaultState = {
  title: "Home"
};

export default function booksReducer(state = defaultState, action) {
  if (action.type !== NAVIGATE) {
    return state;
  }

  document.title = action.title;

  return {
    ...state,
    title: action.title,
    url: action.url,
    parent: action.parent
  };
}
