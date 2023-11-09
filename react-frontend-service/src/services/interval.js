let checkLocalStorageInterval;

const checkLocalStorage = (msg_id) => {
    const reservationData = JSON.parse(localStorage.getItem(msg_id));
    if (reservationData) {
        console.log("id: ", checkLocalStorageInterval);
        if (reservationData.replies.length == 2) {
            return "Reservation is successful";
        } else {

            if (!reservationData.replies.includes("reservation-controller") ){
                console.log("Reservation service is down");
            } else {
                console.log("Database service is down");
            }
            return "Reservation is unsuccessful";

        }
    }
};

const startInterval = (msg_id) => {

    const promise = new Promise((resolve, reject) => {
        checkLocalStorageInterval = setInterval(() => {
            var currentPayload = checkLocalStorage(msg_id);
            clearInterval(checkLocalStorageInterval);
            resolve(currentPayload);
        }, 5000);
    });

    return { promise, intervalId: checkLocalStorageInterval };
};

export { startInterval };