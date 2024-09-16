import axios from "axios";
axios.defaults.withCredentials = true;

export async function fetchUser(setUser, setError) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`);
        setUser(response.data);
    } catch (error) {
        console.error("Failed to fetch user:", error);
        setError('Failed to fetch user');
    }
}
