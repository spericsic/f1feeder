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
                margin="10px 0px 0px 0px">
                <Box 
                    width={650}
                    height={350}
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