import { RestoreBlueIcon, SignUpAccountIcon } from '@masknet/icons'
import { styled } from '@material-ui/core/styles'

export const ColumnContentLayout = styled('div')(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
`,
)

export const Body = styled('main')(({ theme }) => ({
    flex: '1 5',
    width: '78%',
    [theme.breakpoints.down('md')]: {
        width: '95%',
    },
}))

export const Footer = styled('footer')(({ theme }) => ({
    flex: 1,
    width: '78%',
    [theme.breakpoints.down('md')]: {
        width: '95%',
    },
}))

export const SignUpAccountLogo = styled(SignUpAccountIcon)(({ theme }) => ({
    width: '100%',
    height: '96px',
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(2),
    },
}))

export const RestoreBlueLogo = styled(RestoreBlueIcon)(({ theme }) => ({
    width: '100%',
    height: '96px',
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(2),
    },
}))
