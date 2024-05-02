"use client";
import React, { useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import {
    Box,
    Flex,
    Switch,
} from "@mirohq/design-system";

import { Button } from './overrides/Button';
import { Input } from './overrides/Input';
import { Header } from './atoms/Header';
import { auth } from '../app/actions';

export const LoginForm: React.FC = () => {
    const searchParams = useSearchParams();
    const tokenInput = useRef<HTMLInputElement>(null);
    const [storeOnDevice, setStoreOnDevice] = React.useState(false);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const token = tokenInput.current?.value;
        if (token) {
            auth(token, storeOnDevice);
        }
    };

    const message = searchParams.get('message');

    return (
        <Flex direction="column" justify="center" align="center" css={{ height: "100%", padding: 20 }}>
            <form onSubmit={onSubmit}>
                <Flex direction="column" align="stretch" gap={200}>
                    {message && <Box
                        css={{
                            color: '$text-primary-inverted',
                            background: '$background-danger-prominent',
                            padding: '$150',
                        }}
                    >
                        {message}
                    </Box>}
                    <Header>To use MiroBot you have to provide valid Gemini API token!</Header>
                    <Input placeholder="Gemini AI token..." ref={tokenInput}></Input>

                    <Flex align='center' gap={100}>
                        <Switch
                            checked={storeOnDevice}
                            onChecked={() => setStoreOnDevice(true)}
                            onUnchecked={() => setStoreOnDevice(false)} />
                        <label htmlFor='switch-demo' style={{ lineHeight: 1.5 }}>
                            Store token on this device
                        </label>
                    </Flex>

                    <Flex justify="end">
                        <Button
                            aria-label="search"
                            variant="solid-prominent"
                            title="Start chat"
                        >
                            Start Chat
                        </Button>
                    </Flex>
                </Flex>
            </form>
        </Flex >
    );
};
