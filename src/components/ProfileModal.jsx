import { Card, CardContent, CardHeader, CardActions, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { lighten } from '@mui/system';

export default function ProfileCard({ profile }) {
  if (!profile) {
    return <Typography>No profile data available</Typography>; // Fallback if no data is passed
  }

  const theme = useTheme();
  // Defining a common style for the profile details text
  const detailsTextStyle = {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: '1rem',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%', // Ensures the parent div takes the full width of the screen
      }}
    >
      <Card
        sx={{
          backgroundColor: lighten(theme.palette.primary.light, 0.9),
          width: '100%', // Full width for mobile screens
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 3,
          padding: 0.2,
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: '#4E2A84', width: 56, height: 56 }}
              src={profile.photoURL || ''} // Use Google profile picture if available
              alt={profile.name}
            >
              {!profile.photoURL && (profile.name?.[0] || '')}{' '}
              {/* Display initial if there is no Google photo */}
            </Avatar>
          }
          title={
            <Typography
              variant="h5"
              component="div"
              sx={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '540', fontSize: '1.6rem' }}
            >
              {profile.name}
            </Typography>
          }
        />
        <CardContent>
          <Typography variant="body1" sx={detailsTextStyle}>
            <strong>Email:</strong> {profile.email}
          </Typography>
          <Typography variant="body1" sx={detailsTextStyle}>
            <strong>Phone Number:</strong> {profile.phoneNumber}
          </Typography>
          <Typography variant="body1" sx={detailsTextStyle}>
            <strong>Major:</strong> {profile.major}
          </Typography>
          <Typography variant="body1" sx={detailsTextStyle}>
            <strong>Year:</strong> {profile.year}
          </Typography>
          <Typography variant="body1" sx={detailsTextStyle}>
            <strong>Description:</strong> {profile.description}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: 'flex-end',
            padding: 2,
          }}
        ></CardActions>
      </Card>
    </div>
  );
}
