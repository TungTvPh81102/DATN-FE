'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { useForm } from 'react-hook-form'

import { IAuthData } from '@/types'
import { signinFormFieldList } from '@/configs'
import { useSignIn } from '@/hooks/auth/sign-in/useSignIn'

import FormField from '@/components/common/FormField'
import PageImage from '@/components/common/PageImage'
import SocialLogin from '@/components/common/SocialLogin'
import SubmitButton from '@/components/common/SubmitButton'
import ForgotPasswordDialog from '@/sections/signin/_components/forgot-password-dialog'

const SigninView = () => {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthData>()
  const { mutate, isPending } = useSignIn()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const onSubmit = handleSubmit((data) => {
    mutate(data)
  })

  return (
    <div className="main-content page-login">
      <section className="section-page-login login-wrap tf-spacing-4">
        <div className="tf-container">
          <div className="row">
            <div className="col-lg-6">
              <PageImage
                src="/assets/images/page-title/page-title-home2-1.jpg"
                alt=""
                author="Ali Tufan"
                subAuthor="Founder & CEO"
              />
            </div>
            <div className="col-lg-6">
              <div className="content-right">
                <h2
                  className="login-title fw-7 wow fadeInUp font-manrope"
                  data-wow-delay="0s"
                >
                  Đăng nhập ngay bây giờ
                </h2>
                <div className="register">
                  <p className="fw-5 fs-15 wow fadeInUp" data-wow-delay="0s">
                    Bạn chưa có tài khoản?
                  </p>
                  <Link
                    href="/sign-up"
                    className="fw-5 fs-15 wow fadeInUp"
                    data-wow-delay="0s"
                  >
                    Đăng ký
                  </Link>
                </div>
                <form action="#" className="form-login" onSubmit={onSubmit}>
                  {signinFormFieldList.map(
                    ({ id, type, name, label, rules }) => (
                      <FormField
                        id={id}
                        type={type}
                        name={name}
                        label={label}
                        key={name}
                        register={register}
                        error={errors[name]?.message as string}
                        rules={rules}
                      />
                    )
                  )}
                  <div className="mb-6 flex justify-end">
                    <button
                      onClick={() => setIsForgotPasswordOpen(true)}
                      type="button"
                      className="fs-15 wow fadeInUp t"
                      data-wow-delay="0.1s"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <SubmitButton text="Đăng nhập" disabled={isPending} />
                </form>
                <p className="fs-15 wow fadeInUp" data-wow-delay="0s">
                  OR
                </p>
                <SocialLogin />
              </div>
            </div>
          </div>
        </div>
        {/* <div class="login-wrap-content"></div> */}
        <ForgotPasswordDialog
          open={isForgotPasswordOpen}
          onOpenChange={setIsForgotPasswordOpen}
        />
      </section>
    </div>
  )
}

export default SigninView
