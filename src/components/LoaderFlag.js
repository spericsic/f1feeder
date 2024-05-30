import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

const LoaderFlag = (props) => {

    return(
            <Box
                display='flex' 
                flex='1' 
                justifyContent='space-around'
                flexDirection='column'
                height="100vh">
                <Box 
                    margin='auto'
                    width={650}
                    height={400}
                    component='img'
                    alt='Zastavica'
                    src={`${process.env.PUBLIC_URL}/assets/img/F1flag.gif`}
                />
                <Typography variant='h2' display='block' textAlign='center'>Loading...</Typography>
            </Box>
    );
}
export default LoaderFlag;