export function useSession() {
  try {
    const session = localStorage.getItem("token");
    if (session) {
      //return JSON.parse(session);
      return session;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
