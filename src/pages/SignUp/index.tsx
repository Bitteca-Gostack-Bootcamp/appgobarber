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
import * as Yup from 'yup'
import api from '../../services/api'
import Icon from 'react-native-vector-icons/Feather'

import Input from '../../components/Input'
import Button from '../../components/Button'

import logoImg from '../../assets/logo.png'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import getValidationErrors from '../../utils/getValidationErrors'

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from './styles'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const navigation = useNavigation()
  const formRef = useRef<FormHandles>(null)
  const emailInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)

  const handleFormSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome Obrigatório'),
          email: Yup.string()
            .required('Email Obrigatório')
            .email('Digite um email válido'),
          password: Yup.string()
            .required('A senha é Obrigatória')
            .min(6, 'Senha muito curta. Min. 6 Digitos'),
        })
        await schema.validate(data, { abortEarly: false })

        await api.post('/users', data)

        Alert.alert(
          'Cadastro Realizado',
          'Voce ja pode fazer seu login no GoBarber'
        )
        navigation.goBack()
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error)

          formRef.current?.setErrors(errors)
          return
        }

        Alert.alert(
          'Erro no Cadastro',
          'Ocorreu um erro ao fazer o cadastro, tente novamente'
        )
      }
    },
    [navigation]
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
              <Title>Crie sua conta</Title>
            </View>
            <Form
              style={{ width: '100%' }}
              ref={formRef}
              onSubmit={handleFormSubmit}
            >
              <Input
                name='name'
                icon='user'
                placeholder='Nome'
                autoCapitalize='words'
                returnKeyType='next'
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                name='email'
                icon='mail'
                placeholder='E-mail'
                autoCorrect={false}
                autoCapitalize='none'
                keyboardType='email-address'
                returnKeyType='next'
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                name='password'
                icon='lock'
                placeholder='Senha'
                secureTextEntry
                textContentType='newPassword'
                returnKeyType='send'
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm()
                }}
              >
                Criar conta
              </Button>
            </Form>
          </Container>
          <BackToSignInButton onPress={() => navigation.goBack()}>
            <Icon name='arrow-left' size={20} color='#fff' />
            <BackToSignInButtonText>Voltar para logon</BackToSignInButtonText>
          </BackToSignInButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default SignUp
