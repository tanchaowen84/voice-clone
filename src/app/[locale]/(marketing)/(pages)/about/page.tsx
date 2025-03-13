import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { constructMetadata } from '@/lib/metadata';
import { createTitle } from '@/lib/utils';
import { MailIcon } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('AboutPage');

  return constructMetadata({
    title: createTitle(t('title')),
    description: t('description'),
  });
}

/**
 * inspired by https://astro-nomy.vercel.app/about
 */
export default async function AboutPage() {
  const t = await getTranslations('AboutPage');

  return (
    <section className="space-y-8 pb-16">
      {/* about section */}
      <div className="relative max-w-screen-md mx-auto mb-24 mt-8 md:mt-16">
        <div className="mx-auto flex flex-col justify-between">
          <div className="grid gap-8 sm:grid-cols-2">
            {/* avatar and name */}
            <div className="flex items-center gap-8">
              <Avatar className="size-32">
                <AvatarImage
                  className="rounded-full border-2 border-gray-200"
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Avatar"
                />
                <AvatarFallback>
                  <div className="size-32 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-heading text-foreground">
                  {t('authorName')}
                </h1>
                <p className="text-base text-muted-foreground mt-2">
                  {t('authorBio')}
                </p>
              </div>
            </div>

            {/* introduction */}
            <div>
              <p className="mb-8 text-base text-muted-foreground">
                {t('authorIntroduction')}
              </p>

              <div className="flex items-center gap-4">
                <Button className="rounded-lg">
                  <MailIcon className="mr-1 size-4" />
                  <a href={`mailto:${websiteConfig.mail.from}`}>{t('talkWithMe')}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* images section */}
      <div className="relative z-10 flex flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full">
          <div className="relative z-10 mx-auto max-w-7xl">
            {/* Mobile view (1 column) */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl aspect-[4/3]"
                >
                  <Image
                    className="w-full h-full object-cover"
                    src={image.image}
                    alt={image.alt}
                    width={800}
                    height={900}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    priority={index < 2}
                  />
                </div>
              ))}
            </div>

            {/* Tablet view (2 columns) */}
            <div className="hidden sm:grid sm:grid-cols-2 md:hidden gap-4">
              <div className="space-y-4">
                {images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl aspect-[4/3]"
                  >
                    <Image
                      className="w-full h-full object-cover"
                      src={image.image}
                      alt={image.alt}
                      width={800}
                      height={900}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      priority={index < 2}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {images.slice(4, 8).map((image, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl aspect-[4/3]"
                  >
                    <Image
                      className="w-full h-full object-cover"
                      src={image.image}
                      alt={image.alt}
                      width={800}
                      height={900}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      priority={index < 1}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop view (4 columns) */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* First Column */}
              <div className="space-y-4 md:space-y-6">
                <div className="overflow-hidden rounded-xl">
                  <Image
                    className="w-full h-auto object-cover"
                    src={images[0].image}
                    alt={images[0].alt}
                    width={800}
                    height={1226}
                    loading="eager"
                    priority
                  />
                </div>
                <div className="overflow-hidden rounded-xl aspect-[3/4]">
                  <Image
                    className="w-full h-full object-cover"
                    src={images[1].image}
                    alt={images[1].alt}
                    width={800}
                    height={1334}
                    loading="eager"
                    priority
                  />
                </div>
              </div>

              {/* Second Column */}
              <div className="space-y-4 md:space-y-6">
                <div className="overflow-hidden rounded-xl aspect-[4/3]">
                  <Image
                    className="w-full h-full object-cover"
                    src={images[2].image}
                    alt={images[2].alt}
                    width={800}
                    height={983}
                    loading="eager"
                    priority
                  />
                </div>
                <div className="overflow-hidden rounded-xl">
                  <Image
                    className="w-full h-auto object-cover"
                    src={images[3].image}
                    alt={images[3].alt}
                    width={800}
                    height={1108}
                    loading="eager"
                  />
                </div>
                <div className="overflow-hidden rounded-xl aspect-[5/3]">
                  <Image
                    className="w-full h-full object-cover"
                    src={images[4].image}
                    alt={images[4].alt}
                    width={1260}
                    height={750}
                  />
                </div>
              </div>

              {/* Third Column */}
              <div className="space-y-4 md:space-y-6">
                <div className="overflow-hidden rounded-xl aspect-[3/4]">
                  <Image
                    className="w-full h-full object-cover"
                    src={images[5].image}
                    alt={images[5].alt}
                    width={800}
                    height={1334}
                    loading="eager"
                  />
                </div>
                <div className="overflow-hidden rounded-xl aspect-[1/2]">
                  <Image
                    className="w-full h-full object-cover"
                    src={images[6].image}
                    alt={images[6].alt}
                    width={801}
                    height={2477}
                  />
                </div>
              </div>

              {/* Fourth Column */}
              <div className="space-y-4 md:space-y-6">
                <div className="overflow-hidden rounded-xl aspect-square">
                  <Image
                    className="w-full h-full object-cover"
                    src={images[7].image}
                    alt={images[7].alt}
                    width={800}
                    height={900}
                    loading="eager"
                  />
                </div>
                <div className="overflow-hidden rounded-xl aspect-square">
                  <Image
                    className="w-full h-full object-cover"
                    src={images[8].image}
                    alt={images[8].alt}
                    width={800}
                    height={900}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ImagesProps {
  image: string;
  alt: string;
}

const images: ImagesProps[] = [
  // first column
  {
    image:
      'https://images.pexels.com/photos/15372903/pexels-photo-15372903/free-photo-of-computer-setup-with-big-monitor-screen.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'setup desktop',
  },
  {
    image:
      'https://images.pexels.com/photos/1049317/pexels-photo-1049317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'friends smiles',
  },
  // second column
  {
    image:
      'https://images.pexels.com/photos/3712095/pexels-photo-3712095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'grey cat',
  },
  {
    image:
      'https://images.pexels.com/photos/9293249/pexels-photo-9293249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'home building',
  },
  {
    image:
      'https://images.pexels.com/photos/375467/pexels-photo-375467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'pizza laptop',
  },
  // third column
  {
    image:
      'https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'hike and sunset',
  },
  {
    image:
      'https://images.pexels.com/photos/5500779/pexels-photo-5500779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'chinese lantern',
  },
  // fourth column
  {
    image:
      'https://images.pexels.com/photos/2090644/pexels-photo-2090644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'the great wheel',
  },
  {
    image:
      'https://images.pexels.com/photos/7418632/pexels-photo-7418632.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'dalmatian',
  },
];
