import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ProgressContext } from '../context/progressContext';
import api from '../services/api';
import { buildTree } from '../utils/buildTree';
import ProgressTreeView from '../components/progressTreeView';
import { Container, Box, Typography, CircularProgress, Alert, AppBar, Toolbar, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const { progressItems, loading, error, getStudentProgress, clearProgress, overrideItemStatus } = useContext(ProgressContext);

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [loadingStudents, setLoadingStudents] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get('/users/students');
                setStudents(res.data.data);
            } catch (err) {
                console.error("Failed to fetch students:", err);
            } finally {
                setLoadingStudents(false);
            }
        };
        fetchStudents();
    }, []); 

    useEffect(() => {
        if (selectedStudent) {
            getStudentProgress(selectedStudent);
        } else {
            clearProgress();
        }
    }, [selectedStudent, getStudentProgress, clearProgress]);

    const handleStudentChange = (event) => setSelectedStudent(event.target.value);
    const handleLogout = () => { logout(); navigate('/login'); };

    const progressTree = useMemo(() => buildTree(progressItems), [progressItems]);

    const handleOverrideStatus = (itemId, status) => {
        overrideItemStatus(itemId, status, selectedStudent);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Faculty Dashboard
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>Student Progress Overview</Typography>
                
                <FormControl fullWidth sx={{ mb: 4 }} disabled={loadingStudents}>
                    <InputLabel id="student-select-label">Select a Student</InputLabel>
                    <Select
                        labelId="student-select-label"
                        value={selectedStudent}
                        label="Select a Student"
                        onChange={handleStudentChange}
                    >
                        {loadingStudents ? <MenuItem disabled><em>Loading...</em></MenuItem> :
                            students.map((student) => (
                                <MenuItem key={student._id} value={student._id}>
                                    {student.email}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                {!selectedStudent ? (
                    <Alert severity="info">Please select a student to view their progress.</Alert>
                ) : loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <ProgressTreeView 
                        nodes={progressTree}
                        onUpdateStatus={handleOverrideStatus}
                        isFacultyView={true}
                    />
                )}
            </Container>
        </Box>
    );
};

export default FacultyDashboard;

