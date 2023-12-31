import axios from 'axios'

const USER_API_BASE_URL = "http://localhost:8080/api/doctorSpecialities";

class DoctorSpecialitiesService{
    createDoctorSpecialities(speciality: any){
        return axios.post(USER_API_BASE_URL, speciality);
    }
}

export default new DoctorSpecialitiesService()