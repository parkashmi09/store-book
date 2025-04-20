
export const convertUTCToIST = (utcDateTimeString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata', // Indian Standard Time (IST)
    };

    const utcDateTime = new Date(utcDateTimeString);
    return utcDateTime.toLocaleString('en-US', options);
};
