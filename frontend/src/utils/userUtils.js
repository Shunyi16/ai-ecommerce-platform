
export const getOrInitializeUserId = async () => {

    let userId = localStorage.getItem("active_user_id");

    if (!userId) {
        try {
            const db_response = await fetch("http://127.0.0.1:8000/users/guest", {
                method: "POST"
            });

            const data = await db_response.json();
            userId = data.user_id;
            localStorage.setItem("active_user_id", userId);

        } catch (error) {
            console.error("Failed to generate guest ID:", error);
            return 1;
        }
    }
    const parsedId = parseInt(userId);
    return isNaN(parsedId) ? 1 : parsedId;
};