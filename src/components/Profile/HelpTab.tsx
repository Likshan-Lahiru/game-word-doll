export function HelpTab() {
    return (
        <div className="space-y-6 ml-12">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <div>
                <p className="text-sm  mb-4">
                    Have questions or need support?
                </p>
                <div className="flex items-center">
                    <span className="text-sm  mr-2">Email:</span>
                    <a
                        href="mailto:hello@cookycream.com"
                        className=" hover:underline"
                    >
                        hello@cookycream.com
                    </a>
                </div>
            </div>
        </div>
    )
}