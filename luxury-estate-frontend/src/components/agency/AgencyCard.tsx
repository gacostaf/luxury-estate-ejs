import { Link } from 'react-router-dom'
                rel="noreferrer"
                className="truncate hover:text-[#C6A15B] transition-colors"
              >
                {agency.websiteUrl}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3">
            {agency.socials?.facebook && (
              <a
                href={agency.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:bg-[#C6A15B] hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}

            {agency.socials?.instagram && (
              <a
                href={agency.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:bg-[#C6A15B] hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}

            {agency.socials?.linkedin && (
              <a
                href={agency.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:bg-[#C6A15B] hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>

          <Link
            to={`/agencies/${agency.slug}`}
            className="inline-flex items-center rounded-full bg-[#C6A15B] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            View Agency
          </Link>
        </div>
      </div>
    </div>
  )
}