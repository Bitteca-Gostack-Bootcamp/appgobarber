import React, { useCallback, useRef } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAuth } from '../../hooks/auth'

import Input from '../../components/Input'
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native'
import * as Yup from 'yup'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import getValidationErrors from '../../utils/getValidationErrors'

import logoImg from '../../assets/logo.png'

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles'

interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const navigation = useNavigation()
  const { signIn, user } = useAuth()

  console.log(user)

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email Obrigatório')
            .email('Digite um email válido'),
          password: Yup.string().required('Senha obrigtória'),
        })
        await schema.validate(data, { abortEarly: false })
        await signIn({
          email: data.email,
          password: data.password,
        })
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error)

          formRef.current?.setErrors(errors)
          return
        }

        Alert.alert(
          'Erro na autenticaçao',
          'Ocorreu um erro ao fazer login, cheque as credenciais.'
        )
      }
    },
    [signIn]
  )

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Faça seu logon</Title>
            </View>

            <Form
              style={{ width: '100%' }}
              ref={formRef}
              onSubmit={handleSignIn}
            >
              <Input
                name='email'
                icon='mail'
                placeholder='E-mail'
                autoCorrect={false}
                autoCapitalize='none'
                keyboardType='email-address'
                returnKeyType='next'
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />
              <Input
                ref={passwordInputRef}
                name='password'
                icon='lock'
                placeholder='Senha'
                secureTextEntry
                returnKeyType='send'
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm()
                }}
              >
                Entrar
              </Button>
            </Form>

            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>Esqueci Minha Senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
          <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
            <Icon name='log-in' size={20} color='#ff9000' />
            <CreateAccountButtonText>Criar Uma Conta</CreateAccountButtonText>
          </CreateAccountButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default SignIn
