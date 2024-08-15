import { getValidSession, logout } from "../../auth";


export default async function() {
    await getValidSession();

    logout();
}