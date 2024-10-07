import { Card, CardHeader, CardContent, CardActions, Typography, Button } from '@mui/material';

export default function StudentCard({ userProfile }) {
  return (
    <Card>
      <CardHeader
        sx={{ pb: 0 }}
        title={
          <Typography variant="h5" component="h2">
            {userProfile.name}
          </Typography>
        }
        subheader={
          <>
            <Typography color="textSecondary" component="h6">
              {userProfile.major} ({userProfile.year})
            </Typography>
            {userProfile.listOfCourses.length > 0 && userProfile.listOfCourses[0] != '' ? (
              <Typography color="textSecondary" component="h6">
                Courses: {userProfile.listOfCourses.join(',')}
              </Typography>
            ) : (
              <></>
            )}
          </>
        }
      />
      <CardContent>
        <Typography>{userProfile.description}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" variant={'contained'} color={'primary'}>
          Match
        </Button>
      </CardActions>
    </Card>
  );
}
