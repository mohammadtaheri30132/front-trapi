import Cookies from "js-cookie";

// تعریف نوع کلیدهای مجاز
type ClinicKeys = "id" | "name" | "clinicName" | "family" | "username" | "address";

// تعریف نوع کلینیک
interface Clinic {
    id: string;
    name: string;
    clinicName: string;
    family: string;
    username: string;
    address: string;
}

/**
 * دریافت مقدار مشخصی از کلینیک از کوکی
 * @param key - کلید موردنظر برای بازیابی مقدار
 * @returns مقدار کلید در کلینیک یا null اگر مقدار موجود نباشد
 */
export const getClinicProperty = (key: ClinicKeys): string | null => {
    // مقدار clinic را از کوکی بگیر
    const clinicData = Cookies.get("clinic");

    if (!clinicData) {
        console.error("Clinic data not found in cookies.");
        return null;
    }

    try {
        const clinic: Clinic = JSON.parse(clinicData); // تبدیل به نوع Clinic
        return clinic[key] || null; // مقدار کلید یا null
    } catch (error) {
        console.error("Failed to parse clinic data from cookies.", error);
        return null;
    }
};
export const getTherapistProperty = (key): string | null => {
    // مقدار clinic را از کوکی بگیر
    const therapistData = Cookies.get("therapist");
    console.log(therapistData)
    if (!therapistData) {
        console.error("therapistData data not found in cookies.");
        return null;
    }

    try {
        const therapist = JSON.parse(therapistData); // تبدیل به نوع Clinic
        console.log(therapist)

        return therapist[key] || null; // مقدار کلید یا null
    } catch (error) {
        console.error("Failed to parse therapist data from cookies.", error);
        return null;
    }
};
export const  convertFarsiToEnglish=(farsiNum)=> {
    const farsiToEnglish = {
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
    };
  
    return farsiNum.split('').map(char => farsiToEnglish[char] || char).join('');
  }