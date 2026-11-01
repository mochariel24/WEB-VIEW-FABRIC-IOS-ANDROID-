import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import WebView, { WebViewNavigation } from 'react-native-webview';

const INITIAL_URL = 'https://example.com';

const colors = {
  navy: '#102B4E',
  blue: '#2D6CDF',
  turquoise: '#39B8A5',
  ink: '#172B4D',
  muted: '#718198',
  page: '#F3F6FB',
  line: '#E5EAF2',
  white: '#FFFFFF',
  red: '#C83D4D',
};

function App() {
  return (
    <SafeAreaProvider>
      <WebPortal />
    </SafeAreaProvider>
  );
}

function WebPortal() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [pageUrl, setPageUrl] = useState(INITIAL_URL);
  const [address, setAddress] = useState(INITIAL_URL);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  const openAddress = () => {
    const enteredAddress = address.trim();
    if (!enteredAddress) {
      return;
    }

    const normalizedUrl = /^https?:\/\//i.test(enteredAddress)
      ? enteredAddress
      : `https://${enteredAddress}`;

    Keyboard.dismiss();
    setAddress(normalizedUrl);
    setPageUrl(normalizedUrl);
    setHasError(false);
    setIsLoading(true);
  };

  const updateNavigation = (navigation: WebViewNavigation) => {
    setCanGoBack(navigation.canGoBack);
    setCanGoForward(navigation.canGoForward);
    if (/^https?:\/\//i.test(navigation.url)) {
      setAddress(navigation.url);
    }
  };

  const reloadPage = () => {
    setHasError(false);
    setIsLoading(true);
    setProgress(0);
    webViewRef.current?.reload();
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>W</Text>
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>Portal Kampus</Text>
          <Text style={styles.headerSubtitle}>React Native WebView</Text>
        </View>
        <View style={styles.fabricBadge}>
          <View style={styles.fabricDot} />
          <Text style={styles.fabricBadgeText}>FABRIC</Text>
        </View>
      </View>

      <View style={styles.browserPanel}>
        <View style={styles.addressRow}>
          <View style={styles.addressField}>
            <Text style={styles.addressIcon}>↗</Text>
            <TextInput
              accessibilityLabel="Alamat website"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onChangeText={setAddress}
              onSubmitEditing={openAddress}
              placeholder="Masukkan alamat website"
              placeholderTextColor="#94A1B3"
              returnKeyType="go"
              selectTextOnFocus
              style={styles.addressInput}
              value={address}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Buka halaman website"
            onPress={openAddress}
            style={({ pressed }) => [
              styles.openButton,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={styles.openButtonText}>BUKA</Text>
          </Pressable>
        </View>

        <View style={styles.navigationRow}>
          <NavigationButton
            disabled={!canGoBack}
            label="Kembali"
            onPress={() => webViewRef.current?.goBack()}
            symbol="‹"
          />
          <NavigationButton
            disabled={!canGoForward}
            label="Lanjut"
            onPress={() => webViewRef.current?.goForward()}
            symbol="›"
          />
          <NavigationButton
            label="Muat ulang"
            onPress={reloadPage}
            symbol="↻"
          />
          <View style={styles.loadingLabel}>
            <View
              style={[
                styles.loadingDot,
                isLoading && styles.loadingDotActive,
              ]}
            />
            <Text style={styles.loadingText}>
              {isLoading ? 'Memuat halaman' : 'Siap'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressTrack}>
        {isLoading && (
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        )}
      </View>

      <View style={styles.webViewArea}>
        <WebView
          ref={webViewRef}
          source={{ uri: pageUrl }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          onLoadStart={() => {
            setIsLoading(true);
            setProgress(0);
            setHasError(false);
          }}
          onLoadProgress={({ nativeEvent }) =>
            setProgress(nativeEvent.progress)
          }
          onLoadEnd={() => {
            setIsLoading(false);
            setProgress(1);
          }}
          onNavigationStateChange={updateNavigation}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          renderLoading={() => (
            <View style={styles.loadingScreen}>
              <ActivityIndicator color={colors.blue} size="large" />
              <Text style={styles.loadingScreenText}>Memuat halaman web…</Text>
            </View>
          )}
          style={styles.webView}
        />

        {hasError && (
          <View style={styles.errorCard}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>!</Text>
            </View>
            <Text style={styles.errorTitle}>Halaman tidak dapat dibuka</Text>
            <Text style={styles.errorDescription}>
              Periksa koneksi internet atau alamat website, lalu coba lagi.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={reloadPage}
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.buttonPressed,
              ]}>
              <Text style={styles.retryButtonText}>Coba lagi</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <Text style={styles.footerTitle}>ARSITEKTUR BARU AKTIF</Text>
        <Text numberOfLines={1} style={styles.footerUrl}>
          {address}
        </Text>
      </View>
    </View>
  );
}

type NavigationButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  symbol: string;
};

function NavigationButton({
  disabled = false,
  label,
  onPress,
  symbol,
}: NavigationButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.navigationButton,
        disabled && styles.navigationButtonDisabled,
        pressed && !disabled && styles.navigationButtonPressed,
      ]}>
      <Text
        style={[
          styles.navigationSymbol,
          disabled && styles.navigationSymbolDisabled,
        ]}>
        {symbol}
      </Text>
      <Text
        style={[
          styles.navigationLabel,
          disabled && styles.navigationLabelDisabled,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  header: {
    minHeight: 86,
    backgroundColor: colors.navy,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {
    color: colors.white,
    fontSize: 21,
    fontWeight: '800',
  },
  headerCopy: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: '#CBD7E8',
    fontSize: 12,
    marginTop: 2,
  },
  fabricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B3D63',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  fabricDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#6CE0BE',
    marginRight: 6,
  },
  fabricBadgeText: {
    color: '#E8F5F4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  browserPanel: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressField: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 13,
    paddingHorizontal: 12,
  },
  addressIcon: {
    color: colors.muted,
    fontSize: 18,
    marginRight: 8,
  },
  addressInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    color: colors.ink,
    fontSize: 14,
  },
  openButton: {
    minHeight: 46,
    minWidth: 66,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,
    paddingHorizontal: 12,
    borderRadius: 13,
    backgroundColor: colors.blue,
  },
  openButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.78,
  },
  navigationRow: {
    minHeight: 61,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
  },
  navigationButton: {
    minWidth: 49,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  navigationButtonDisabled: {
    opacity: 0.45,
  },
  navigationButtonPressed: {
    backgroundColor: '#EDF2FA',
  },
  navigationSymbol: {
    color: colors.ink,
    fontSize: 24,
    lineHeight: 25,
    fontWeight: '500',
  },
  navigationSymbolDisabled: {
    color: '#AAB5C4',
  },
  navigationLabel: {
    color: colors.muted,
    fontSize: 9,
    marginTop: 1,
  },
  navigationLabelDisabled: {
    color: '#AAB5C4',
  },
  loadingLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 2,
  },
  loadingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#9AA8BA',
    marginRight: 6,
  },
  loadingDotActive: {
    backgroundColor: colors.turquoise,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 11,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.white,
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.turquoise,
  },
  webViewArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  webView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  loadingScreenText: {
    color: colors.muted,
    marginTop: 12,
    fontSize: 13,
  },
  errorCard: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.white,
  },
  errorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FCEBED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIconText: {
    color: colors.red,
    fontSize: 25,
    fontWeight: '700',
  },
  errorTitle: {
    marginTop: 14,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorDescription: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 11,
    backgroundColor: colors.blue,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    minHeight: 48,
    backgroundColor: colors.white,
    paddingTop: 9,
    paddingHorizontal: 17,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  footerTitle: {
    color: colors.turquoise,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  footerUrl: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
});

export default App;
