export const AppointmentService = {
    // Mock de agendamentos existentes
    appointments: [
        {
            id: '100',
            doctorId: '1',
            patientId: '1', // João Silva (do PatientService)
            patientName: 'João Silva Santos',
            date: new Date().toISOString().split('T')[0], // Hoje
            time: '09:00',
            status: 'confirmed'
        },
        {
            id: '101',
            doctorId: '3',
            patientId: '2',
            patientName: 'Maria Oliveira Costa',
            date: new Date().toISOString().split('T')[0], // Hoje
            time: '14:30',
            status: 'pending'
        }
    ],

    getAppointments() {
        return Promise.resolve(this.appointments);
    },

    getAppointmentsByDateAndDoctor(dateStr, doctorId) {
        // dateStr no formato YYYY-MM-DD
        return Promise.resolve(
            this.appointments.filter(a => a.date === dateStr && a.doctorId === doctorId)
        );
    },

    addAppointment(appointment) {
        const newApp = {
            ...appointment,
            id: Math.random().toString(36).substr(2, 9),
            status: 'confirmed'
        };
        this.appointments.push(newApp);
        return Promise.resolve(newApp);
    }
};
