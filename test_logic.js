const isoString = "2026-06-14T14:49:00.000Z"; // From DateTimePicker
const localStr = "2026-06-14T16:47"; // From toLocalDatetime

const updates = {
    dueDate: new Date(isoString).toISOString(),
    startDate: new Date(localStr).toISOString()
};

const start = new Date(updates.startDate).getTime();
const end = new Date(updates.dueDate).getTime();
console.log("start:", start);
console.log("end:", end);
if (end > start) {
    updates.estimatedMinutes = Math.round((end - start) / 60000);
}
console.log(updates);
