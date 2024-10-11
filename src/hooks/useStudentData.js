import { useEffect, useState } from 'react';

import { getAllUsers } from '../utils/firestore/general';

export default function useStudentData() {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const students = await getAllUsers();
        setStudentData(students);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };
    fetchStudentData();
  }, []);

  return studentData;
}
