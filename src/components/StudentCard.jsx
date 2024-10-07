import { useEffect, useState } from 'react';

import { Card, CardHeader, CardContent, CardActions, Typography, Button } from '@mui/material';

import { createMatch } from '../utils/firestore';

export default function StudentCard({ userProfile, studentUserProfile }) {
  const [requested, setRequested] = useState(null);

  useEffect(() => {
    if (userProfile && studentUserProfile) {
      setRequested(
        userProfile.outgoingMatches.some((match) => match.requestedUser === studentUserProfile.uid),
      );
    }
  }, [userProfile, studentUserProfile]);

  const onMatch = () => {
    if (requested !== null && !requested) {
      createMatch([studentUserProfile.uid, userProfile.uid], 'University Library');
      setRequested(true);
    }
  };

  // TODO: Show loading indicator while requested is being calculated
  return (
    <Card>
      <CardHeader
        sx={{ pb: 0 }}
        title={
          <Typography variant="h5" component="h2">
            {studentUserProfile.name}
          </Typography>
        }
        subheader={
          <>
            <Typography color="textSecondary" component="h6">
              {studentUserProfile.major} ({studentUserProfile.year})
            </Typography>
            {studentUserProfile.listOfCourses.length > 0 &&
            studentUserProfile.listOfCourses[0] != '' ? (
              <Typography color="textSecondary" component="h6">
                Courses: {studentUserProfile.listOfCourses.join(',')}
              </Typography>
            ) : (
              <></>
            )}
          </>
        }
      />
      <CardContent>
        <Typography>{studentUserProfile.description}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          size="small"
          variant={requested ? 'outlined' : 'contained'}
          color={requested ? 'default' : 'primary'}
          onClick={onMatch}
        >
          {requested ? 'Requested' : 'Match'}
        </Button>
      </CardActions>
    </Card>
  );
}
