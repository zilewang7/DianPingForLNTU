import React, { useState, useRef } from 'react';
import {
    Alert,
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Dimensions,
    LayoutAnimation,
    UIManager,
    TextInput,
} from 'react-native';
import { Input, Button, Icon, InputProps } from '@rneui/themed';
import { createUser, userLogin } from '../api/user.api';
import { setUserAuth } from '../util/user';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

type TabSelectorProps = {
    selected: boolean;
};

const TabSelector: React.FunctionComponent<TabSelectorProps> = ({
    selected,
}) => {
    return (
        <View style={styles.selectorContainer}>
            <View style={selected && styles.selected} />
        </View>
    );
};

type LoginScreenState = {};
type LoginScreenProps = { navigation };

const LoginScreen: React.FunctionComponent<LoginScreenState> = (
    props: LoginScreenProps
) => {
    const { navigation } = props;
    const [isLoading, setLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [isUsernameValid, setUsernameValid] = useState<boolean>(true);
    const [password, setPassword] = useState<string>('');
    const [isPasswordValid, setPasswordValid] = useState<boolean>(true);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isConfirmPasswordValid, setConfirmPasswordValid] =
        useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const usernameInput = useRef<InputProps & TextInput>(null);
    const passwordInput = useRef<InputProps & TextInput>(null);
    const confirmationInput = useRef<InputProps & TextInput>(null);

    const isLoginPage = selectedCategory === 0;
    const isSignUpPage = selectedCategory === 1;

    const selectCategory = (selectedCategoryIndex: number) => {
        LayoutAnimation.easeInEaseOut();
        setLoading(false);
        setSelectedCategory(selectedCategoryIndex);
    };

    const validateUsername = (testUsername: string) => {
        const re = /^[\u4E00-\u9FA5\w]{1,16}$/
        return re.test(testUsername);
    };

    const login = async () => {
        setLoading(true);
        const isUsernameValidFlag =
            validateUsername(username) || usernameInput.current.shake();
        const isPasswordValidFlag =
            password.length >= 8 || passwordInput.current.shake();

        LayoutAnimation.easeInEaseOut();
        setUsernameValid(!!isUsernameValidFlag);
        setPasswordValid(!!isPasswordValidFlag);
        if (isUsernameValidFlag && isPasswordValidFlag) {
            try {
                const res = await userLogin(username, password);
                if (!res.ok) {
                    Alert.alert('用户名或密码错误');
                    return;
                }
                setUserAuth(res.json);
            } catch {
                Alert.alert('🔗⁉️', '网络连接出错')
                return;
            } finally {
                setLoading(false);
            }
            navigation.goBack();
        }
        setLoading(false);
    };

    const signUp = async () => {
        setLoading(true);
        const isUsernameValidFlag =
            validateUsername(username) || usernameInput.current.shake();
        const isPasswordValidFlag =
            password.length >= 8 || passwordInput.current.shake();
        const isConfirmPasswordValidFlag =
            password === confirmPassword || confirmationInput.current.shake();

        LayoutAnimation.easeInEaseOut();
        setUsernameValid(!!(validateUsername(username) || usernameInput.current.shake()));
        setPasswordValid(!!(password.length >= 8 || passwordInput.current.shake()));
        setConfirmPasswordValid(
            !!(password === confirmPassword || confirmationInput.current.shake())
        );

        if (
            isUsernameValidFlag &&
            isPasswordValidFlag &&
            isConfirmPasswordValidFlag
        ) {
            try {
                const res = await createUser(username, password);
                if (!res.ok) {
                    Alert.alert('用户名已存在', '换一个用户名试试');
                    return;
                }
                setUserAuth(res.json);
            } catch {
                Alert.alert('🔗⁉️', '网络连接出错')
                return;
            } finally {
                setLoading(false);
            }
            Alert.alert('🎉', '注册成功');
            navigation.goBack();
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'http://img.heimao.icu/75307614.jpg' }}
                style={styles.bgImage}
            >
                <View>
                    <View style={styles.titleContainer}>
                        <View>
                            <Text style={styles.titleText}>欢迎使用工大点评</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            disabled={isLoading}
                            type="clear"
                            activeOpacity={0.7}
                            onPress={() => selectCategory(0)}
                            containerStyle={{ flex: 1 }}
                            titleStyle={[
                                styles.categoryText,
                                isLoginPage && styles.selectedCategoryText,
                            ]}
                            title="登录"
                        />
                        <Button
                            disabled={isLoading}
                            type="clear"
                            activeOpacity={0.7}
                            onPress={() => selectCategory(1)}
                            containerStyle={{ flex: 1 }}
                            titleStyle={[
                                styles.categoryText,
                                isSignUpPage && styles.selectedCategoryText,
                            ]}
                            title="注册"
                        />
                    </View>
                    <View style={styles.rowSelector}>
                        <TabSelector selected={isLoginPage} />
                        <TabSelector selected={isSignUpPage} />
                    </View>
                    <View style={styles.formContainer}>
                        <Input
                            leftIcon={
                                <Icon
                                    name="user"
                                    type="simple-line-icon"
                                    color="rgba(0, 0, 0, 0.38)"
                                    size={25}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                            }
                            value={username}
                            keyboardAppearance="light"
                            autoFocus={false}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            inputStyle={{ marginLeft: 10, color: 'grey' }}
                            placeholder={'用户名'}
                            containerStyle={{
                                borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                            }}
                            ref={usernameInput}
                            onSubmitEditing={() => passwordInput.current.focus()}
                            onChangeText={(text) => setUsername(text)}
                            errorMessage={
                                isUsernameValid ? '' : '用户名为字母、数字、汉字与下划线组成，最长16字'
                            }
                        />
                        <Input
                            leftIcon={
                                <Icon
                                    name="lock"
                                    type="simple-line-icon"
                                    color="rgba(0, 0, 0, 0.38)"
                                    size={25}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                            }
                            value={password}
                            keyboardAppearance="light"
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={true}
                            returnKeyType={isSignUpPage ? 'next' : 'done'}
                            blurOnSubmit={true}
                            containerStyle={{
                                marginTop: 16,
                                borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                            }}
                            inputStyle={{ marginLeft: 10, color: 'grey' }}
                            placeholder={'密码'}
                            ref={passwordInput}
                            onSubmitEditing={() => {
                                isSignUpPage ? confirmationInput.current.focus() : login();
                            }}
                            onChangeText={(text) => setPassword(text)}
                            errorMessage={
                                isPasswordValid ? '' : '密码长度不小于8位'
                            }
                        />
                        {isSignUpPage && (
                            <Input
                                leftIcon={
                                    <Icon
                                        name="lock"
                                        type="simple-line-icon"
                                        color="rgba(0, 0, 0, 0.38)"
                                        size={25}
                                        style={{ backgroundColor: 'transparent' }}
                                    />
                                }
                                value={confirmPassword}
                                secureTextEntry={true}
                                keyboardAppearance="light"
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType={'done'}
                                blurOnSubmit={true}
                                containerStyle={{
                                    marginTop: 16,
                                    borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                                }}
                                inputStyle={{ marginLeft: 10, color: 'grey' }}
                                placeholder={'确认密码'}
                                ref={confirmationInput}
                                onSubmitEditing={signUp}
                                onChangeText={(text) => setConfirmPassword(text)}
                                errorMessage={
                                    isConfirmPasswordValid ? '' : '请输入相同的密码'
                                }
                            />
                        )}
                        <Button
                            buttonStyle={styles.loginButton}
                            containerStyle={{ marginTop: 32, flex: 0 }}
                            activeOpacity={0.8}
                            title={isLoginPage ? '登录' : '注册'}
                            onPress={isLoginPage ? login : signUp}
                            titleStyle={styles.loginTextButton}
                            loading={isLoading}
                            disabled={isLoading}
                        />
                    </View>
                    <View style={styles.helpContainer}>
                        <Button
                            title={'需要帮助?'}
                            titleStyle={{ color: 'white' }}
                            buttonStyle={{ backgroundColor: 'transparent' }}
                            onPress={() => Alert.alert('😭', '暂未支持忘记密码功能')}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: 20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'grey',
    },
    rowSelector: {
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectorContainer: {
        flex: 1,
        alignItems: 'center',
    },
    selected: {
        position: 'absolute',
        borderRadius: 50,
        height: 0,
        width: 0,
        top: -5,
        borderRightWidth: 70,
        borderBottomWidth: 70,
        borderColor: 'white',
        backgroundColor: 'white',
    },
    loginTextButton: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    loginButton: {
        borderRadius: 10,
        height: 50,
        width: 200,
    },
    titleContainer: {
        height: 150,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    formContainer: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH - 30,
        borderRadius: 10,
        paddingTop: 32,
        paddingBottom: 32,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    bgImage: {
        flex: 1,
        top: 0,
        left: 0,
        width: '100%',
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        backgroundColor: 'transparent',
        opacity: 0.54,
    },
    selectedCategoryText: {
        opacity: 1,
    },
    titleText: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
    },
    helpContainer: {
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoginScreen;