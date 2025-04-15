  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const success = await createService({
  //       name: formData.name,
  //       price: formData.price,
  //       duration: formData.duration,
  //       description: formData.description,
  //     });

  //     if (success) {
  //       setFormData({
  //         name: '',
  //         price: '',
  //         duration: '',
  //         description: '',
  //         category: ''
  //       });
  //       const servicesData = await getServices();
  //       setServices(servicesData);
  //     }
  //   } catch (error) {
  //     console.error('Error creating service:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleUpdateService = async (serviceId: string, updatedData: Partial<Service>) => {
  //   setLoading(true);

  //   try {
  //     const success = await updateService(serviceId, {
  //       ...updatedData,
  //     });

  //     if (success) {
  //       const servicesData = await getServices();
  //       setServices(servicesData);
  //     }
  //   } catch (error) {
  //     console.error('Error updating service:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }; 