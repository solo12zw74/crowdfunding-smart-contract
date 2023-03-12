import React, { useEffect, useState, useMemo } from 'react'
import { Button, Table, Message } from 'semantic-ui-react'
import {
  useParams,
} from 'react-router-dom'

import { getWeb3 } from '../ethereum/utils'

import ContributeInput from './ContributeInput'
import FailedStateInput from './FailedStateInput'
import SuccededStateInput from './SucceededStateInput'
import { getContract } from '../ethereum/utils'

const ONGOING_STATE = '0'
const FAILED_STATE = '1'
const SUCCEEDED_STATE = '2'

export default function Campaign() {

    const [contractInfo, setContractInfo] = useState({
        name: 'N/A',
        targetAmount: 0,
        totalCollected: 0,
        campaignFinished: false,
        deadline: new Date(0),
        isBeneficiary: true,
        contributedAmount: 10,
        state: ONGOING_STATE
    })

    return <Table celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Value</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>

            <Table.Row>
                <Table.Cell>Name</Table.Cell>
                <Table.Cell>{contractInfo.name}</Table.Cell>
            </Table.Row>

            <Table.Row>
                <Table.Cell>Target amount</Table.Cell>
                <Table.Cell>{contractInfo.targetAmount}</Table.Cell>
            </Table.Row>

            <Table.Row>
                <Table.Cell>Has finished</Table.Cell>
                <Table.Cell>{contractInfo.campaignFinished.toString()}</Table.Cell>
            </Table.Row>

            <Table.Row>
                <Table.Cell>Deadline</Table.Cell>
                <Table.Cell>{contractInfo.deadline.toString()}</Table.Cell>
            </Table.Row>

            <Table.Row>
                <Table.Cell>I am beneficiary</Table.Cell>
                <Table.Cell>{contractInfo.isBeneficiary.toString()}</Table.Cell>
            </Table.Row>

            <Table.Row>
                <Table.Cell>Contributed amount</Table.Cell>
                <Table.Cell>{contractInfo.contributedAmount.toString()}</Table.Cell>
            </Table.Row>

            <Table.Row>
                <Table.Cell>Contract state</Table.Cell>
                <Table.Cell>{contractInfo.state}</Table.Cell>
            </Table.Row>

        </Table.Body>

        <Table.Footer fullWidth>
            <Table.Row>
                <Table.HeaderCell colSpan="2">
                </Table.HeaderCell>
            </Table.Row>
        </Table.Footer>
    </Table>
}
