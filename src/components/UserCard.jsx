import { Card, CardHeader, CardContent, CardActions, Typography, Button } from '@mui/material';

export default function StudentCard({ studentUserProfile, actions }) {
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
            studentUserProfile.listOfCourses[0] !== '' ? (
              <Typography color="textSecondary" component="h6">
                Courses: {studentUserProfile.listOfCourses.join(',')}
              </Typography>
            ) : null}
          </>
        }
      />
      <CardContent>
        <Typography>{studentUserProfile.description}</Typography>
      </CardContent>
      {actions ? (
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              size="small"
              variant={action.variant || 'contained'}
              color={action.color || 'primary'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </CardActions>
      ) : (
        <></>
      )}
    </Card>
  );
}
