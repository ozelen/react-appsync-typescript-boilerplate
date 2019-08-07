import React, { Component, ReactNode } from 'react';
import PropTypes from 'prop-types';

import AWSAppSyncClient from 'aws-appsync';
import { RehydratedState } from 'aws-appsync-react';
import { RehydratedProps } from 'aws-appsync-react/lib/rehydrated';

interface NewRehydratedProps extends RehydratedProps {
    client: AWSAppSyncClient<any>;
}

interface RehydrateProps extends RehydratedProps {
    rehydrated: boolean;
    children?: ReactNode;
}

const Rehydrate = (props: RehydrateProps) => (
    <div
        className={`awsappsync ${
            props.rehydrated
                ? 'awsappsync--rehydrated'
                : 'awsappsync--rehydrating'
        }`}
    >
        {props.rehydrated ? props.children : <span>Loading...</span>}
    </div>
);

export class Rehydrated extends Component<NewRehydratedProps, RehydratedState> {
    static propTypes = {
        render: PropTypes.func,
        children: PropTypes.node,
        loading: PropTypes.node,
        client: PropTypes.instanceOf(AWSAppSyncClient).isRequired,
    };

    constructor(props: NewRehydratedProps) {
        super(props);

        this.state = {
            rehydrated: false,
        };
    }

    async componentWillMount() {
        await this.props.client.hydrated();

        this.setState({
            rehydrated: true,
        });
    }

    render() {
        const { render, children, loading } = this.props;
        const { rehydrated } = this.state;

        if (render) return render({ rehydrated });

        if (children) {
            if (loading) return rehydrated ? children : loading;

            return <Rehydrate rehydrated={rehydrated}>{children}</Rehydrate>;
        }
    }
}
