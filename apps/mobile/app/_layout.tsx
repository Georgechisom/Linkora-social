import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Linking } from 'react-native'

import { parseDeepLink } from '../utils/deepLinks'

export default function RootLayout() {
    const router = useRouter()

    useEffect(() => {
        let isMounted = true

        async function handleInitialUrl() {
            let initialUrl: string | null = null

            try {
                initialUrl = await Linking.getInitialURL()
            } catch {
                return
            }

            if (isMounted && initialUrl) {
                handleDeepLink(initialUrl)
            }
        }

        function handleDeepLink(url: string) {
            const deepLink = parseDeepLink(url)

            if (!deepLink) {
                return
            }

            router.push(deepLink.path)
        }

        const subscription = Linking.addEventListener('url', ({ url }) => {
            handleDeepLink(url)
        })

        handleInitialUrl()

        return () => {
            isMounted = false
            subscription.remove()
        }
    }, [router])

    return <Stack />
}
