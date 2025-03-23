'use client'

import React, { useState } from 'react'

import MeBanner from '../_components/me-banner'
import MeSideBar from '../_components/me-sidebar'

const MeView = () => {
  const [content, setContent] = useState<React.ReactNode>(null)
  return (
    <div>
      <MeBanner />
      <div className="mt-10">
        <div className="page-inner">
          <div className="tf-container">
            <div className="row">
              <div className="col-xl-3 col-lg-12">
                <MeSideBar
                  onSelect={(component) => {
                    setContent(component)
                  }}
                />
              </div>
              <div className="col-xl-9 col-lg-12">
                <div>{content || <div> Không có dữ liệu</div>}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeView
