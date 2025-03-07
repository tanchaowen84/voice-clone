import { siteConfig } from "@/config/site";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import {
  anchor,
  box,
  button,
  container,
  footer,
  footerLeft,
  footerRight,
  hr,
  main,
  paragraph,
} from "./email-formats";
import { getBaseUrl } from "@/lib/urls/get-base-url";

interface ResetPasswordEmailProps {
  userName?: string;
  resetLink?: string;
}

/**
 * email for reset password
 */
export const ResetPasswordEmail = ({
  userName,
  resetLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src={`${getBaseUrl()}/logo.png`}
              width="32"
              height="32"
              alt="Logo"
            />
            <Hr style={hr} />
            <Text style={paragraph}>Hi {userName},</Text>
            <Text style={paragraph}>
              Someone recently requested a password change for your account. If
              this was you, you can set a new password here:
            </Text>
            <Button style={button} href={resetLink}>
              Reset password
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={paragraph}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
            <Text style={paragraph}>
              Thanks, <br />
              The{" "}
              <Link style={anchor} href={getBaseUrl()}>
                {siteConfig.name}
              </Link>{" "}
              team
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              <span style={footerLeft}>
                &copy; {new Date().getFullYear()}
                &nbsp;&nbsp; All Rights Reserved.
              </span>
              <span style={footerRight}>
              </span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  userName: "Mksaas",
  resetLink: "https://demo.mksaas.com",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;
