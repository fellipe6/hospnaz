export const DoctorService = {
    getDoctorsData() {
        return [
            {
                id: '1',
                name: 'Dr. Roberto Alves',
                specialty: 'Cardiologia',
                crm: '123456-SP',
                image: 'roberto.png',
                workingDays: [1, 3, 5], // Seg, Qua, Sex
                startHour: 8,
                endHour: 18
            },
            {
                id: '2',
                name: 'Dra. Ana Clara',
                specialty: 'Dermatologia',
                crm: '654321-SP',
                image: 'ana.png',
                workingDays: [2, 4], // Ter, Qui
                startHour: 9,
                endHour: 17
            },
            {
                id: '3',
                name: 'Dr. João Pereira',
                specialty: 'Ortopedia',
                crm: '112233-SP',
                image: 'joao.png',
                workingDays: [1, 2, 3, 4, 5], // Seg a Sex
                startHour: 10,
                endHour: 16
            },
            {
                id: '4',
                name: 'Dra. Beatriz Lima',
                specialty: 'Pediatria',
                crm: '445566-SP',
                image: 'beatriz.png',
                workingDays: [1, 2, 3, 4, 5], 
                startHour: 8,
                endHour: 12
            },
            {
                id: '5',
                name: 'Dr. Fernandes',
                specialty: 'Clínico Geral',
                crm: '998877-SP',
                image: 'fernandes.png',
                workingDays: [1, 2, 3, 4, 5, 6], // Inclui Sábado
                startHour: 8,
                endHour: 20
            }
        ];
    },

    getDoctors() {
        return Promise.resolve(this.getDoctorsData());
    },

    getDoctorsByDate(date) {
        const dayOfWeek = date.getDay(); // 0 = Dom, 1 = Seg, etc.
        const allDoctors = this.getDoctorsData();
        return Promise.resolve(allDoctors.filter(doc => doc.workingDays.includes(dayOfWeek)));
    }
};
