export function getNextFiveDays() {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const shortDaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const dayInfoArray = [];

  for (let i = 0; i < 5; i++) {
    const currentDay = new Date(today);
    currentDay.setDate(today.getDate() + i);

    const dayInfo = {
      key: currentDay.toISOString().split("T")[0],
      title: shortDaysOfWeek[currentDay.getDay()],
      full: currentDay.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    dayInfoArray.push(dayInfo);
  }

  return dayInfoArray;
}

export const PickupTimes = [
  { label: "Select Reservation Time", value: "" },
  { label: "10:00 AM", value: "10:00" },
  { label: "10:15 AM", value: "10:15" },
  { label: "10:30 AM", value: "10:30" },
  { label: "10:45 AM", value: "10:45" },
  { label: "11:00 AM", value: "11:00" },
  { label: "11:15 AM", value: "11:15" },
  { label: "11:30 AM", value: "11:30" },
  { label: "11:45 AM", value: "11:45" },
  { label: "12:00 PM", value: "12:00" },
  { label: "12:15 PM", value: "12:15" },
  { label: "12:30 PM", value: "12:30" },
  { label: "12:45 PM", value: "12:45" },
  { label: "1:00 PM", value: "13:00" },
  { label: "1:15 PM", value: "13:15" },
  { label: "1:30 PM", value: "13:30" },
  { label: "1:45 PM", value: "13:45" },
  { label: "2:00 PM", value: "14:00" },
  { label: "2:15 PM", value: "14:15" },
  { label: "2:30 PM", value: "14:30" },
  { label: "2:45 PM", value: "14:45" },
  { label: "3:00 PM", value: "15:00" },
  { label: "3:15 PM", value: "15:15" },
  { label: "3:30 PM", value: "15:30" },
  { label: "3:45 PM", value: "15:45" },
  { label: "4:00 PM", value: "16:00" },
  { label: "4:15 PM", value: "16:15" },
  { label: "4:30 PM", value: "16:30" },
  { label: "4:45 PM", value: "16:45" },
  { label: "5:00 PM", value: "17:00" },
  { label: "5:15 PM", value: "17:15" },
  { label: "5:30 PM", value: "17:30" },
  { label: "5:45 PM", value: "17:45" },
  { label: "6:00 PM", value: "18:00" },
  { label: "6:15 PM", value: "18:15" },
  { label: "6:30 PM", value: "18:30" },
  { label: "6:45 PM", value: "18:45" },
  { label: "7:00 PM", value: "19:00" },
  { label: "7:15 PM", value: "19:15" },
  { label: "7:30 PM", value: "19:30" },
  { label: "7:45 PM", value: "19:45" },
  { label: "8:00 PM", value: "20:00" },
  { label: "8:15 PM", value: "20:15" },
  { label: "8:30 PM", value: "20:30" },
  { label: "8:45 PM", value: "20:45" },
  { label: "9:00 PM", value: "21:00" },
  { label: "9:15 PM", value: "21:15" },
  { label: "9:30 PM", value: "21:30" },
  { label: "9:45 PM", value: "21:45" },
  { label: "10:00 PM", value: "22:00" },
  { label: "10:15 PM", value: "22:15" },
  { label: "10:30 PM", value: "22:30" },
  { label: "10:45 PM", value: "22:45" },
  { label: "11:00 PM", value: "23:00" },
];

export const PickupParticipants = [
  {
    label: "Select Participants",
    value: "",
  },
  {
    label: "1 Person",
    value: "1",
  },
  {
    label: "2 People",
    value: "2",
  },
  {
    label: "3 People",
    value: "3",
  },
  {
    label: "4 People",
    value: "4",
  },
  {
    label: "5 People",
    value: "5",
  },
  {
    label: "6 People",
    value: "6",
  },
  {
    label: "7 People",
    value: "7",
  },
  {
    label: "8 People",
    value: "8",
  },
  {
    label: "9 People",
    value: "9",
  },
  {
    label: "10 People",
    value: "10",
  },
  {
    label: "11 People",
    value: "11",
  },
  {
    label: "12 People",
    value: "12",
  },
  {
    label: "13 People",
    value: "13",
  },
  {
    label: "14 People",
    value: "14",
  },
  {
    label: "15 People",
    value: "15",
  },
  {
    label: "16 People",
    value: "16",
  },
  {
    label: "17 People",
    value: "17",
  },
  {
    label: "18 People",
    value: "18",
  },
  {
    label: "19 People",
    value: "19",
  },
  {
    label: "20 People",
    value: "20",
  },
];

export const pickerOptions = [
  { label: "Select", value: "" },
  { label: "Add Me", value: "Add Me" },
  { label: "Vertical Member", value: "Vertical Member" },
  { label: "Member", value: "Member" },
  { label: "Current Registered Guest", value: "Current Registered Guest" },
  { label: "Past Registered Guest", value: "Past Registered Guest" },
  { label: "Add New Guest", value: "Add New Guest" },
  { label: "TBD", value: "TBD" },
];
