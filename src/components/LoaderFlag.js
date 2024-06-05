import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

const LoaderFlag = () => {

    return(
            <Box
                display='flex' 
                flex='1' 
                justifyContent='space-around'
                alignItems='center'
                flexDirection='column'
                height="100%"
                margin="5%">
                <Box 
                    width={650}
                    height={400}
                    component='img'
                    alt='Zastavica'
                    src={`${process.env.PUBLIC_URL}/assets/img/F1flag.gif`}
                />
                <Typography 
                    variant='h2' 
                    display='block' 
                    textAlign='center'
                    color="white"
                    paddingBottom={10}>Loading...</Typography>
            </Box>
    );
}
export default LoaderFlag;