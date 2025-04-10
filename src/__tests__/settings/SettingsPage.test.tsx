import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SettingsForm } from "@/components/settings/SettingsForm"

// Mock des dépendances
vi.mock("@supabase/auth-helpers-nextjs", () => ({
  createClientComponentClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: "test-user" } } })),
    },
    from: vi.fn(() => ({
      upsert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  })),
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe("SettingsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("affiche correctement le formulaire des paramètres", () => {
    render(<SettingsForm />)

    expect(screen.getByText("Configuration")).toBeInTheDocument()
    expect(screen.getByText("Notifications par email")).toBeInTheDocument()
    expect(screen.getByText("Thème")).toBeInTheDocument()
    expect(screen.getByText("Langue")).toBeInTheDocument()
    expect(screen.getByText("Confidentialité")).toBeInTheDocument()
  })

  it("permet de modifier les paramètres", async () => {
    render(<SettingsForm />)

    // Modification des paramètres
    const emailSwitch = screen.getByRole("switch", { name: /notifications par email/i })
    fireEvent.click(emailSwitch)

    const themeSelect = screen.getByRole("combobox", { name: /thème/i })
    fireEvent.click(themeSelect)
    const darkOption = screen.getByText("Sombre")
    fireEvent.click(darkOption)

    const submitButton = screen.getByRole("button", { name: /enregistrer les modifications/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(createClientComponentClient().from().upsert).toHaveBeenCalledWith({
        user_id: "test-user",
        emailNotifications: false,
        theme: "dark",
        language: "fr",
        privacyEnabled: true,
      })
    })
  })

  it("gère les erreurs de soumission", async () => {
    vi.mocked(createClientComponentClient).mockImplementationOnce(() => ({
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: { id: "test-user" } } })),
      },
      from: vi.fn(() => ({
        upsert: vi.fn(() => Promise.resolve({ error: new Error("Test error") })),
      })),
    }))

    render(<SettingsForm />)

    const submitButton = screen.getByRole("button", { name: /enregistrer les modifications/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/erreur lors de la mise à jour des paramètres/i)).toBeInTheDocument()
    })
  })

  it("redirige vers la page de connexion si non authentifié", async () => {
    vi.mocked(createClientComponentClient).mockImplementationOnce(() => ({
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
      },
      from: vi.fn(),
    }))

    const { push } = vi.mocked(useRouter)()
    render(<SettingsForm />)

    const submitButton = screen.getByRole("button", { name: /enregistrer les modifications/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/auth/login")
    })
  })
}) 