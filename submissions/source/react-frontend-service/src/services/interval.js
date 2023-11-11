
const checkLocalStorage = (msg_id, checkLocalStorageInterval) => {
    const reservationData = JSON.parse(localStorage.getItem(msg_id));
    if (reservationData) {

        if (reservationData.replies.length == 2) {
            clearInterval(checkLocalStorageInterval);
            return "Reservation is successful";
        } else {

            if (!reservationData.replies.includes("reservation-controller") ){
                console.log("Reservation service is down");
            } else if(!reservationData.replies.includes("database-controller") ){
                console.log("Database service is down");
            }
            clearInterval(checkLocalStorageInterval);
            return "Reservation is unsuccessful";
        }
    }
    clearInterval(checkLocalStorageInterval);
};

const startInterval = (msg_id) => {
    let checkLocalStorageInterval;

    const promise = new Promise((resolve, reject) => {
        checkLocalStorageInterval = setInterval(() => {
            var currentPayload = checkLocalStorage(msg_id, checkLocalStorageInterval);
            resolve(currentPayload);
        }, 5000);
    });

    return { promise, intervalId: checkLocalStorageInterval };
};

export { startInterval };