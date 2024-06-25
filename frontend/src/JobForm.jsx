import React, { useState } from 'react';
import axios from 'axios';

const JobForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        jobType: '',
        jobSource: '',
        jobDescription: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        area: '',
        startDate: '',
        startTime: '',
        endTime: '',
        testSelect: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/jobs', formData);
            if (response.status === 200) {
                alert('Form submitted successfully');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Client details</h2>
            <label>First name: <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required /></label><br />
            <label>Last name: <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required /></label><br />
            <label>Phone: <input type="text" name="phone" value={formData.phone} onChange={handleChange} required /></label><br />
            <label>Email (optional): <input type="email" name="email" value={formData.email} onChange={handleChange} /></label><br />

            <h2>Job details</h2>
            <label>Job type: <input type="text" name="jobType" value={formData.jobType} onChange={handleChange} required /></label><br />
            <label>Job source: <input type="text" name="jobSource" value={formData.jobSource} onChange={handleChange} required /></label><br />
            <label>Job description (optional): <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange}></textarea></label><br />

            <h2>Service location</h2>
            <label>Address: <input type="text" name="address" value={formData.address} onChange={handleChange} required /></label><br />
            <label>City: <input type="text" name="city" value={formData.city} onChange={handleChange} required /></label><br />
            <label>State: <input type="text" name="state" value={formData.state} onChange={handleChange} required /></label><br />
            <label>Zip code: <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required /></label><br />
            <label>Area: <input type="text" name="area" value={formData.area} onChange={handleChange} required /></label><br />

            <h2>Scheduled</h2>
            <label>Start date: <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required /></label><br />
            <label>Start time: <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required /></label><br />
            <label>End time: <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required /></label><br />
            <label>Test select: 
                <select name="testSelect" value={formData.testSelect} onChange={handleChange} required>
                    <option value="test1">Test 1</option>
                    <option value="test2">Test 2</option>
                </select>
            </label><br />

            <button type="submit">Submit</button>
        </form>
    );
};

export default JobForm;
