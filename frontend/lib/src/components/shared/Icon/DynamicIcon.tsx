/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2024)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Suspense } from "react"

import { IconSize, ThemeColor } from "@streamlit/lib/src/theme"
import { EmojiIcon } from "./Icon"
import camelCase from "lodash/camelCase"
import startCase from "lodash/startCase"
import DynamicIconErrorBoundary from "./DynamicIconErrorBoundary"
import MaterialFontIcon from "./Material/MaterialFontIcon"

const MaterialFilled = React.lazy(
  () =>
    import("@streamlit/lib/src/components/shared/Icon/Material/MaterialFilled")
)

const MaterialOutlined = React.lazy(
  () =>
    import(
      "@streamlit/lib/src/components/shared/Icon/Material/MaterialOutlined"
    )
)

const MaterialRounded = React.lazy(
  () =>
    import(
      "@streamlit/lib/src/components/shared/Icon/Material/MaterialRounded"
    )
)

interface IconPackEntry {
  pack: string
  icon: string
}

function parseIconPackEntry(iconName: string): IconPackEntry {
  // This is a regex to match icon pack and icon name from the strings of format
  // :pack:icon: like :material:SettingsSuggest:
  const iconRegexp = /^:(.*)\/(.*):$/
  const matchResult = iconName.match(iconRegexp)
  if (matchResult === null) {
    return { pack: "emoji", icon: iconName }
  }
  const iconPack = matchResult[1]
  let iconNameInPack = matchResult[2]

  // Convert the icon name to CamelCase
  iconNameInPack = startCase(camelCase(iconNameInPack)).replace(/ /g, "")

  return { pack: iconPack, icon: iconNameInPack }
}

interface DynamicIconProps {
  iconValue: string
  size?: IconSize
  margin?: string
  padding?: string
  testid?: string
  color?: ThemeColor
}

const DynamicIconDispatcher = ({
  iconValue,
  ...props
}: DynamicIconProps): React.ReactElement => {
  const { pack, icon } = parseIconPackEntry(iconValue)
  switch (pack) {
    case "material":
      return <MaterialFilled iconName={icon} {...props} />
    case "material-outlined":
      return <MaterialOutlined iconName={icon} {...props} />
    case "material-rounded":
      return <MaterialRounded iconName={icon} {...props} />
    case "material-original":
    case "material-original-filled":
      return <MaterialFontIcon pack={pack} iconName={icon} {...props} />
    case "emoji":
    default:
      return <EmojiIcon {...props}>{icon}</EmojiIcon>
  }
}

export const DynamicIcon = (props: DynamicIconProps): React.ReactElement => (
  // TODO[kajarenc] Remove suspense and error boundary here
  <Suspense
    fallback={<EmojiIcon {...props}>&nbsp;</EmojiIcon>}
    key={props.iconValue}
  >
    <DynamicIconErrorBoundary {...props}>
      <DynamicIconDispatcher {...props} />
    </DynamicIconErrorBoundary>
  </Suspense>
)
