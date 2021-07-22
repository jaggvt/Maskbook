import { resolveAddressLinkOnExplorer, useChainId } from '@masknet/web3-shared'
import { Avatar, Button, Grid, Link, makeStyles, Typography } from '@material-ui/core'
import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { Trans } from 'react-i18next'
import { useRemoteControlledDialog } from '@masknet/shared'
import { useI18N } from '../../../utils/i18n-next-ui'
import { useAvatar } from '../hooks/useManager'
import { usePoolURL } from '../hooks/useUrl'
import { PluginDHedgeMessages } from '../messages'
import type { Pool } from '../types'
import { EthereumChainBoundary } from '../../../web3/UI/EthereumChainBoundary'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    title: {
        padding: theme.spacing(1, 0),
        display: 'flex',
        alignItems: 'center',
        '& > :last-child': {
            marginTop: 4,
            marginLeft: 4,
        },
    },
    meta: {
        fontSize: 14,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        display: 'flex',
        alignItems: 'left',
    },
    avatar: {
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
    text: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': '4',
        '-webkit-box-orient': 'vertical',
    },
    button: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        fontWeight: 500,
    },
    chip: {
        width: '100%',
        fontSize: 'x-small',
    },
}))

interface PoolDeckProps {
    pool: Pool
    inputTokens: string[] | undefined
}

export function PoolViewDeck(props: PoolDeckProps) {
    const { pool, inputTokens } = props

    const classes = useStyles()
    const { t } = useI18N()

    const blockie = useAvatar(pool.managerAddress)
    const chainId = useChainId()
    const poolUrl = usePoolURL(pool.address)

    //#region manager share
    const managerShare = new BigNumber(pool.balanceOfManager)
        .dividedBy(pool.totalSupply)
        .multipliedBy(100)
        .integerValue(BigNumber.ROUND_UP)

    //#endregion

    //#region the invest dialog
    const { setDialog: openInvestDialog } = useRemoteControlledDialog(PluginDHedgeMessages.events.InvestDialogUpdated)
    const onInvest = useCallback(() => {
        if (!pool || !inputTokens) return
        openInvestDialog({
            open: true,
            pool: pool,
            tokens: inputTokens,
        })
    }, [pool, openInvestDialog])
    //#endregion

    return (
        <Grid container className={classes.meta} direction="row">
            <Grid item alignSelf="center" xs={2}>
                <Link target="_blank" rel="noopener noreferrer" href={poolUrl}>
                    <Avatar src={blockie} className={classes.avatar} />
                </Link>
            </Grid>
            <Grid item xs={6}>
                <div className={classes.title}>
                    <Link color="primary" target="_blank" rel="noopener noreferrer" href={poolUrl}>
                        <Typography variant="h6">{pool.name.toUpperCase()}</Typography>
                    </Link>
                </div>
                <Grid container className={classes.meta} direction="column" spacing={0.5}>
                    <Grid item>
                        <Typography variant="body2" color="textPrimary" className={classes.text}>
                            <Trans
                                i18nKey="plugin_dhedge_managed_by"
                                components={{
                                    manager: (
                                        <Link
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={resolveAddressLinkOnExplorer(chainId, pool.managerAddress)}
                                        />
                                    ),
                                }}
                                values={{
                                    managerName: pool.managerName,
                                }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" color="textSecondary" className={classes.text}>
                            <Trans
                                i18nKey="plugin_dhedge_manager_share"
                                components={{
                                    share: <span />,
                                }}
                                values={{
                                    managerShare: managerShare,
                                }}
                            />
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item alignSelf="right" xs={4} textAlign="center">
                <EthereumChainBoundary chainId={pool.chainId}>
                    <Button className={classes.button} variant="contained" fullWidth color="primary" onClick={onInvest}>
                        {t('plugin_dhedge_invest')}
                    </Button>
                </EthereumChainBoundary>
            </Grid>
        </Grid>
    )
}
