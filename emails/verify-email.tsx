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

interface VerifyEmailProps {
  confirmLink?: string;
}

/**
 * email for verify email
 */
export const VerifyEmail = ({ confirmLink }: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirm your email address</Preview>
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
            <Text style={paragraph}>Confirm your email address</Text>
            <Text style={paragraph}>
              Thanks for starting the new account creation process. We want to
              make sure it's really you. Please click the confirmation link to
              continue.
            </Text>
            <Button style={button} href={confirmLink}>
              Confirm Email
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>
              If you don&apos;t want to create an account, you can ignore this
              message.
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

VerifyEmail.PreviewProps = {
  confirmLink: "https://demo.mksaas.com",
} as VerifyEmailProps;

export default VerifyEmail;
