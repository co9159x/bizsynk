  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const success = await createAppointment({
  //       clientName: formData.clientName,
  //       service: formData.service,
  //       date: formData.date,
  //       time: formData.time,
  //     });

  //     if (success) {
  //       setFormData({
  //         clientName: '',
  //         service: '',
  //         date: '',
  //         time: '',
  //         notes: ''
  //       });
  //       const appointmentsData = await getAppointments();
  //       setAppointments(appointmentsData);
  //     }
  //   } catch (error) {
  //     console.error('Error creating appointment:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
  //   setLoading(true);

  //   try {
  //     const success = await updateAppointment(appointmentId, {
  //       status: newStatus,
  //     });

  //     if (success) {
  //       const appointmentsData = await getAppointments();
  //       setAppointments(appointmentsData);
  //     }
  //   } catch (error) {
  //     console.error('Error updating appointment:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }; 